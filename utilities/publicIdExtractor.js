export const extractPublicId = (url) => {
      const parts = url.split("/");
      const fileWithExt = parts.pop();
      const [publicId] = fileWithExt.split(".");
      const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
      return folder ? `${folder}/${publicId}` : publicId;
    };

