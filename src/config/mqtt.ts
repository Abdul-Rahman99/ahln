/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mqtt, { IClientOptions } from 'mqtt';
import config from '../../config';
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import PlaybackModel from '../models/logs/playback.model';
import db from '../config/database';
import UserBoxModel from '../models/box/user.box.model';
import NotificationModel from '../models/logs/notification.model';
import UserDevicesModel from '../models/users/user.devices.model';
import SystemLogModel from '../models/logs/system.log.model';
import UserModel from '../models/users/user.model';
import i18n from './i18n';
import BoxModel from '../models/box/box.model';
import AddressModel from '../models/box/address.model';
import { sendNotificationIfNearby } from '../controllers/extra.controller';

const addressModel = new AddressModel();
const boxModel = new BoxModel();
const userModel = new UserModel();
const systemLog = new SystemLogModel();
const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const userBox = new UserBoxModel();
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

// export let client: MqttClient;
let imageCount = 0;
let videoTimer: NodeJS.Timeout | null = null; // Timer to control video creation delay
const imagesPerVideo = 1000000000000000;
const videoDelay = 4 * 1000; // 10 seconds delay after last image before creating video

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

// get users boxes with boxes ids

async function get_user_ids() {
  const connection = db.connect();
  try {
    const sql = `SELECT id FROM users`;
    const result = db.query(sql);
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const client = mqtt.connect(options);
const mainTopic = 'ahlanBox';
const usersTopic = 'ahlanOwner';
const topics: string[] = [];
const users: string[] = [];
const door: string[] = [];
client.on('connect', async () => {
  console.log('MQTT Connected');

  await get_box_ids()
    .then((result: any) => {
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

  await get_box_ids()
    .then((result: any) => {
      result.rows.forEach((row: { id: any }) => {
        users.push(`${usersTopic}/ahlanOwner_${row.id}/doorAction`);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  // console.log(users);

  await get_box_ids()
    .then((result: any) => {
      result.rows.forEach((row: { id: any }) => {
        door.push(`${mainTopic}/ahlanBox_${row.id}/doorAction`);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  // console.log(door);

  client.subscribe(topics, function (err) {
    if (err) {
      console.error('Subscription error:', err);
    } else if (topics) {
      // console.log('Subscribed to topic:', topics);
    } else {
      console.log('Unable to Subscribe to topic:');
    }
  });

  client.subscribe(users, function (err) {
    if (err) {
      console.error('Subscription error:', err);
    } else if (users) {
      // console.log('Subscribed to topic:', users);
    } else {
      console.log('Unable to Subscribe to topic:');
    }
  });

  client.subscribe(door, function (err) {
    if (err) {
      console.error('Subscription error:', err);
    } else if (users) {
      // console.log('Subscribed to topic:', users);
    } else {
      console.log('Unable to Subscribe to topic:');
    }
  });

  client.subscribe(
    'ahlanOwner/ahlanOwner_Ahln_24_B0000001/location',
    function (err) {
      if (err) {
        console.error('Subscription error:', err);
      } else {
        // console.log('Subscribed to topic: ahlanOwner/ahlanOwner_Ahln_24_B0000001/location');
      }
    },
  );
});

client.on('message', async (topic, message) => {
  const messageString = message.toString();
  const parsedTopic = topic.split('/');
  let boxId = '';
  // console.log(parsedTopic);

  if (parsedTopic[0] === 'ahlanBox' && parsedTopic[2] === 'liveStream') {
    boxId = parsedTopic[1].replace(/ahlanBox_/g, '');

    tag = parsedTopic[2];

    const boxPlaybackFolder = path.join(
      __dirname,
      `../../uploads/playback/${boxId}`,
    );
    if (!fs.existsSync(boxPlaybackFolder)) {
      fs.mkdirSync(boxPlaybackFolder, { recursive: true });
    }

    uploadImage(messageString, boxPlaybackFolder, boxId);
  } else if (
    parsedTopic[0] === 'ahlanOwner' &&
    parsedTopic[2] === 'doorAction'
  ) {
    boxId = parsedTopic[1].replace(/ahlanOwner_/g, '');
    // console.log(boxId);
    // console.log(parsedTopic[2]);
    const parsedMessage = JSON.parse(messageString);

    const door = parsedMessage.door;
    const hex = parsedMessage.hex;
    const status = parsedMessage.statu;

    // get user boxes by box id
    const users = await userBox.getUserBoxesByBoxId(boxId);
    const responseArray: string[] = [];
    users.forEach((user) => {
      responseArray.push(user.user_id);
    });

    for (let i = 0; i < responseArray.length; i++) {
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
        responseArray[i],
      );
      try {
        notificationModel.pushNotification(fcmToken, `Ahln`, status);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'doorActionMqtt';
        systemLog.createSystemLog(
          responseArray[i],
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
    }
  } else if (parsedTopic[0] === 'ahlanBox' && parsedTopic[2] === 'doorAction') {
    boxId = parsedTopic[1].replace(/ahlanBox_/g, '');
    const doorStatus = message.toString();
    // get user boxes by box id
    const users = await userBox.getUserBoxesByBoxId(boxId);
    const responseArray: string[] = [];
    users.forEach((user) => {
      responseArray.push(user.user_id);
    });

    if (doorStatus === 'FE') {
      for (let i = 0; i < responseArray.length; i++) {
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
          responseArray[i],
        );
        try {
          notificationModel.pushNotification(
            fcmToken,
            'Ahln',
            i18n.__('DOOR_1_OPENED'),
          );
        } catch (error: any) {
          const source = 'doorActionMqtt';
          systemLog.createSystemLog(
            responseArray[i],
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      }
    } else if (doorStatus === 'FB') {
      for (let i = 0; i < responseArray.length; i++) {
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
          responseArray[i],
        );
        try {
          notificationModel.pushNotification(
            fcmToken,
            'Ahln',
            i18n.__('DOOR_2_OPENED'),
          );
        } catch (error: any) {
          const source = 'doorActionMqtt';
          systemLog.createSystemLog(
            responseArray[i],
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      }
    } else if (doorStatus === 'FA') {
      for (let i = 0; i < responseArray.length; i++) {
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
          responseArray[i],
        );
        try {
          notificationModel.pushNotification(
            fcmToken,
            'Ahln',
            i18n.__('DOOR_1_AND_2_OPENED'),
          );
        } catch (error: any) {
          const source = 'doorActionMqtt';
          systemLog.createSystemLog(
            responseArray[i],
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      }
    } else if (doorStatus === 'EF') {
      for (let i = 0; i < responseArray.length; i++) {
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
          responseArray[i],
        );
        try {
          notificationModel.pushNotification(
            fcmToken,
            'Ahln',
            i18n.__('DOOR_3_OPENED'),
          );
        } catch (error: any) {
          const source = 'doorActionMqtt';
          systemLog.createSystemLog(
            responseArray[i],
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      }
    } else if (doorStatus === 'EE') {
      for (let i = 0; i < responseArray.length; i++) {
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
          responseArray[i],
        );
        try {
          notificationModel.pushNotification(
            fcmToken,
            'Ahln',
            i18n.__('DOOR_1_AND_3_OPENED'),
          );
        } catch (error: any) {
          const source = 'doorActionMqtt';
          systemLog.createSystemLog(
            responseArray[i],
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      }
    } else if (doorStatus === 'EB') {
      for (let i = 0; i < responseArray.length; i++) {
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
          responseArray[i],
        );
        try {
          notificationModel.pushNotification(
            fcmToken,
            'Ahln',
            i18n.__('DOOR_2_AND_3_OPENED'),
          );
        } catch (error: any) {
          const source = 'doorActionMqtt';
          systemLog.createSystemLog(
            responseArray[i],
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      }
    } else if (doorStatus === 'EA') {
      for (let i = 0; i < responseArray.length; i++) {
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
          responseArray[i],
        );
        try {
          notificationModel.pushNotification(
            fcmToken,
            'Ahln',
            i18n.__('DOOR_1_AND_2_AND_3_OPENED'),
          );
        } catch (error: any) {
          const source = 'doorActionMqtt';
          systemLog.createSystemLog(
            responseArray[i],
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      }
    } else if (doorStatus === 'FF') {
      for (let i = 0; i < responseArray.length; i++) {
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(
          responseArray[i],
        );
        try {
          notificationModel.pushNotification(
            fcmToken,
            'Ahln',
            i18n.__('DOOR_CLOSED'),
          );
        } catch (error: any) {
          const source = 'doorActionMqtt';
          systemLog.createSystemLog(
            responseArray[i],
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      }
    }
  } else if (parsedTopic[0] === 'ahlanOwner' && parsedTopic[2] === 'location') {
    const parsedMessage = JSON.parse(messageString);
    const lat = parsedMessage.lat;
    const long = parsedMessage.long;

    // fetch box lat and long from database
    const boxId = parsedTopic[1].replace(/ahlanOwner_/g, '');
    const box = await boxModel.getOne(boxId);
    // User needs to be added
    const addressData = await addressModel.getOne(
      box.address_id,
      'Ahln_24_U0000002',
    );

    const notified = sendNotificationIfNearby(
      lat,
      long,
      addressData?.lat as number,
      addressData?.lang as number,
      'Ahln_24_U0000002', // needs to be changed from static to dynamic
    );

    if (!notified) {
      console.error('No notifications sent');
    }
  }
});

client.on('error', (error) => {
  console.error('MQTT error:', error);
});

client.on('reconnect', () => {
  console.log('MQTT Reconnected');
});

client.on('end', () => {
  console.log('MQTT Disconnected');
});

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
    const imageName = `image-${String(imageIndex).padStart(9, '0')}.jpg`;
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

  const imagePattern = `${imageFolder}/image-%09d.jpg`;
  const fps = 15;

  try {
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
  } catch (error: any) {
    console.error(`Error creating video: ${error.message}`);
    try {
      exec(
        `find . -type f -iname /home/pc/ahln/uploads/playback/${boxId}*.jpg -delete`,
      );
    } catch (error: any) {
      console.error(`Error deleting images: ${error.message}`);
    }
  }
}
