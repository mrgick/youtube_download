const CORSPROXYURL = "https://docker-nginx-cors.onrender.com/";
const ytdl = window.require("ytdl-core-browser")({
  proxyUrl: CORSPROXYURL,
});

const get_data_from_video = async (url) => {
  let info = await ytdl.getInfo(url);
  let audio = ytdl.chooseFormat(info.formats, {
    quality: "highest",
    filter: "audioonly",
  });
  let video = ytdl.chooseFormat(info.formats, {
    quality: "highest",
    filter: "videoonly",
  });
  return [info, audio, video];
};

const downloadFile = async (fileName, fileUrl) => {
  fetch(fileUrl)
    .then((response) => {
      // Check that the response is successful
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      // Create a new Blob object with the file data
      return response.blob();
    })
    .then((blob) => {
      // Create a new URL object with the Blob as the source
      const url = URL.createObjectURL(blob);

      // Create a new anchor element with the URL as the href
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

      // Trigger a download by simulating a click on the anchor element
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error(error);
    });
};

const download = async (e) => {
  e.preventDefault();
  let formData = Object.fromEntries(new FormData(e.target));
  [info, audio, video] = await get_data_from_video(formData.link);

  if (formData.media === "audio") {
    downloadFile("audio." + audio.container, CORSPROXYURL + audio.url);
  } else {
    downloadFile("video." + video.container, CORSPROXYURL + video.url);
  }

  return false;
};
