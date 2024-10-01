import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
// import { Playback } from '../../types/playback.type';
import PlaybackModel from '../../models/logs/playback.model';

const systemLog = new SystemLogModel();
const playbackModel = new PlaybackModel();

// export function createPlayback(
//   box_id: string,
//   video_link: string,
// ): Promise<Playback> {
//   try {
//     return playbackModel.createPlayback(video_link, box_id);
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// }

export const getAllPlaybackByBox = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const box_id = req.params.box_id;

      const fromDate = req.query.fromDate as string;
      const toDate = req.query.toDate as string;

      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;

      let playback = await playbackModel.getAllPlaybackByBox(
        box_id,
        fromDate,
        toDate,
        limit,
        page,
      );
      if (playback.length === 0) {
        playback = [];
      }
      ResponseHandler.success(
        res,
        i18n.__('PLAYBACK_RETRIEVED_SUCCESSFULLY'),
        playback,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      if (user === '0') {
        return user;
      }
      const source = 'getAllPlaybackByBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
