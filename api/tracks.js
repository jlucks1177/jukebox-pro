import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsByTrackId } from "#db/queries/playlists";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.use(getUserFromToken);
router.use(requireUser);

router.get("/:id/playlists", async (req, res, next) => {
  const trackId = req.params.id;
  const track = await getTrackById(trackId);
  if (!track) return res.status(404).send("Track not found.");
  const userId = req.user.id;

  const playlists = await getPlaylistsByTrackId(trackId);
  const userPlaylists = playlists.filter(
    (playlist) => playlist.user_id === userId
  );

  res.status(200).send(userPlaylists);
});
