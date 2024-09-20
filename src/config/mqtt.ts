/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import config from '../../config';
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import PlaybackModel from '../models/logs/playback.model';
import db from '../config/database';
import { liveStream } from 'src/controllers/delivery/image.controller';

const playbackModel = new PlaybackModel();
let tag = '';
const options: IClientOptions = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT as any,
  protocol: config.MQTT_PROTOCOL as any,
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
};

let lastVideoCreationTime = moment();
const videoInterval = 60 * 60 * 1000; // 1 hour in milliseconds

export let client: MqttClient;
let imageCount = 0;
let videoTimer: NodeJS.Timeout | null = null; // Timer to control video creation delay
const imagesPerVideo = 1000000000000000;
const videoDelay = 10000; // 10 seconds delay after last image before creating video

async function get_box_ids() {
  const connection = db.connect();
  try {
    const sql = `SELECT id FROM box`;
    const result = db.query(sql);
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

async function connect() {
  client = mqtt.connect(options);
  const mainTopic = 'ahlanBox';
  const topics: string[] = [];
  client.on('connect', async () => {
    console.log('MQTT Connected');

    await get_box_ids()
      .then((result: any) => {
        // console.log(result.rows);
        // console.log(result)
        result.rows.forEach((row: { id: any }) => {
          topics.push(`${mainTopic}/ahlanBox_${row.id}/liveStream`);
        });
        result.rows.forEach((row: { id: any }) => {
          topics.push(`${mainTopic}/ahlanBox_${row.id}/deliveryStream`);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    // console.log(topics);
    // const selectedTopic = `ahlanBox/ahlanBox_${}`;

    client.subscribe(topics, function (err) {
      if (err) {
        console.error('Subscription error:', err);
      } else if (topics) {
        // console.log('Subscribed to topic:', topics);
      } else {
        console.log('Unable to Subscribe to topic:');
      }
    });
  });

  client.on('message', (topic, message) => {
    const messageString = message.toString();
    const parsedTopic = topic.split('/');
    const boxId = parsedTopic[1].replace(/ahlanBox_/g, '');

    tag = parsedTopic[2];

    const boxPlaybackFolder = path.join(
      __dirname,
      `../../uploads/playback/${boxId}`,
    );
    if (!fs.existsSync(boxPlaybackFolder)) {
      fs.mkdirSync(boxPlaybackFolder, { recursive: true });
    }

    uploadImage(messageString, boxPlaybackFolder, boxId);
  });

  client.on('error', (error) => {
    client.end();
    setTimeout(connect, 10000);
  });

  client.on('reconnect', () => {});

  client.on('end', () => {
    setTimeout(connect, 10000);
  });
}

connect();

async function uploadImage(
  base64Image: string,
  folderPath: string,
  boxId: string,
) {
  try {
    const buffer = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const imageIndex = await getNextImageIndex(folderPath);
    const imageName = `image-${String(imageIndex).padStart(3, '0')}.jpg`;
    const imagePath = path.join(folderPath, imageName);

    await fs.promises.writeFile(imagePath, buffer);

    const fileStats = await fs.promises.stat(imagePath);
    if (fileStats.size === 0) {
      console.error(`File ${imagePath} is empty or corrupt.`);
      return;
    }

    imageCount++;
    // console.log(`Image saved: ${imagePath}`);

    resetVideoTimer(boxId, folderPath); // Reset the video creation timer
  } catch (err) {
    console.error('Error saving the image file:', err);
  }
}

function resetVideoTimer(boxId: string, folderPath: string) {
  if (videoTimer) {
    clearTimeout(videoTimer); // Reset the timer if images keep coming
  }

  videoTimer = setTimeout(async () => {
    console.log('No images received for a while, creating video...');
    const outputFilePath = path.join(
      folderPath,
      `video-${lastVideoCreationTime.format('YYYYMMDD_HHmmss')}.mp4`,
    );

    try {
      await createVideoFromImages(boxId, outputFilePath);
      lastVideoCreationTime = moment(); // Update the last video creation time
      imageCount = 0; // Reset image count after video is created
    } catch (error: any) {
      console.error('Error creating video:', error.message);
    }
  }, videoDelay); // Wait for 10 seconds after the last image
}

async function getNextImageIndex(folderPath: string): Promise<number> {
  const files = await fs.promises.readdir(folderPath);
  const imageFiles = files.filter(
    (file) => file.startsWith('image-') && file.endsWith('.jpg'),
  );
  const lastImage = imageFiles.sort().pop();
  if (!lastImage) return 1;
  const lastIndex = parseInt(
    lastImage.replace('image-', '').replace('.jpg', ''),
    10,
  );
  return lastIndex + 1;
}

async function cleanUpInvalidFiles(imageFolder: string) {
  const files = await fs.promises.readdir(imageFolder);
  for (const file of files) {
    const filePath = path.join(imageFolder, file);
    const fileStats = await fs.promises.stat(filePath);
    if (fileStats.size === 0) {
      console.log(`Removing invalid file: ${filePath}`);
      await fs.promises.unlink(filePath);
    }
  }
}

async function createVideoFromImages(boxId: string, outputFilePath: string) {
  const imageFolder = path.join(__dirname, `../../uploads/playback/${boxId}`);
  console.log('Creating video from images in folder:', imageFolder);

  // Clean up invalid files before creating the video
  await cleanUpInvalidFiles(imageFolder);

  const imagePattern = `${imageFolder}/image-%03d.jpg`;
  const fps = 30;

  const ffmpegCommand = `ffmpeg -framerate ${fps} -i ${imagePattern} -c:v libx264 -pix_fmt yuv420p ${outputFilePath}`;
  exec(ffmpegCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating video: ${error.message}`);
      return;
    }
    console.log('Video created successfully:', outputFilePath);
    // Delete the images from the folder after video created with extension jpg

    // create record in the playback
    const finalPath = outputFilePath.replace(`${process.env.UPLOADS}/`, '');
    await playbackModel.createPlayback(finalPath, boxId, tag);

    // Delete the images from the folder
    const files = await fs.promises.readdir(imageFolder);
    const images = files.filter((file) => file.endsWith('.jpg'));
    for (const image of images) {
      const filePath = path.join(imageFolder, image);
      await fs.promises.unlink(filePath);
    }
  });
}