/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const query = {
      text: `SELECT
                playlists.*,
                songs.id as song_id,
                songs.title as song_title, 
                songs.performer
            FROM playlists
            LEFT JOIN playlistssongs ON playlistssongs.playlistid = playlists.id 
            LEFT JOIN songs ON songs.id = playlistssongs.songid
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    const songs = result.rows.map(({ song_id, song_title, performer }) => ({
      id: song_id,
      title: song_title,
      performer,
    }));

    return {
      playlist: { id: result.rows[0].id, name: result.rows[0].name, songs },
    };
  }
}

module.exports = PlaylistsService;
