import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3",
  params: { key: process.env.REACT_APP_YOUTUBE_API_KEY },
});

class YoutubeApi {
  constructor() {
    this.client = axiosClient;
  }

  getVideoDetail = async (id) => {
    const { data } = await this.client.get("/videos", {
      params: { part: "snippet", id },
    });
    const [{ snippet }] = data.items;
    return snippet;
  };
}

const youtubeApi = new YoutubeApi();

export default youtubeApi;
