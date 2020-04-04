const button = document.getElementById('button');
button.addEventListener('click', () => {
  input.click();
});

const input = document.getElementById('input');
input.addEventListener('change', (e) => {
  // 获取上传的第一张图片（input 标签可以多个文件上传）
  const imgFile = input.files[0];
  const fileReader = new FileReader();

  // 创建 FileReader 对象获取图片的 url
  fileReader.readAsDataURL(imgFile);
  fileReader.onload = ({ target: { result: fileUrl } }) => {
    getGreyImageUrlFromNormalImageUrl(fileUrl).then((greyImageUrl) => {
      const a = document.createElement('a');
      // a 标签的 href 指向图片的 url
      a.href = greyImageUrl;
      a.download = imgFile.name;
      a.innerText = '点我下载';
      document.getElementById('page').appendChild(a);

      const newImage = new Image();
      newImage.src = greyImageUrl;
      newImage.style = 'max-height: 50vh; max-width: 50vw;';
      document.getElementById('page').appendChild(newImage);
    });
  };
});

function getGreyImageUrlFromNormalImageUrl(imageUrl) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const canvas = document.getElementById('canvas');
      const canvasCtx = canvas.getContext('2d');
      // 设置 canvas 与图片等尺寸
      canvas.width = image.width;
      canvas.height = image.height;
      // 用 canvas 画出图片
      canvasCtx.drawImage(image, 0, 0, image.width, image.height);
      const imageData = canvasCtx.getImageData(0, 0, image.width, image.height);
      // 将图片数据灰化
      // 灰化算法参考 https://github.com/aooy/blog/issues/4
      for (let i = 0; i < imageData.data.length; ) {
        // 每个像素有 4 个数据，rgba，a 为透明度
        const red = imageData.data[i];
        const green = imageData.data[i + 1];
        const blue = imageData.data[i + 2];

        const grey = red * 0.3 + green * 0.59 + blue * 0.11;
        imageData.data[i++] = grey;
        imageData.data[i++] = grey;
        imageData.data[i++] = grey;
        i++;
      }
      // 用灰化的数据画图片
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      canvasCtx.putImageData(imageData, 0, 0);
      const greyImageUrl = canvas.toDataURL();

      resolve(greyImageUrl);
    };
  });
}
