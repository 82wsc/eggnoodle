<template>
  <main>
    <div class="content">
      <div class="top">
        <img src="@/assets/egglogo.png" alt="Menu" class="egglogo-image" />
      </div>
      <div class="bottom">
        <h2>CCTV를 연결하세요</h2>
        <input type="file" @change="onFileChange" class="file-input" />
        <button @click="uploadFile" class="upload-button">
          파일 업로드 및 분석
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "ModelPage",
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFile() {
      if (!this.selectedFile) {
        alert("파일을 선택해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("video", this.selectedFile);

      try {
        console.log("파일 업로드 시작");
        const response = await axios.post(
          "http://localhost:5000/predict", // 플라스크 서버 주소 확인
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("응답:", response.data);
      } catch (error) {
        console.error("파일 업로드 오류:", error);
      }
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: "Bold";
  src: url("@/assets/GmarketSansTTFBold.ttf") format("truetype");
}
@font-face {
  font-family: "Light";
  src: url("@/assets/GmarketSansTTFLight.ttf") format("truetype");
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  background-color: #f9f9f9;
}
.content {
  text-align: center;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.top {
  margin: 30px 0;
}
.egglogo-image {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
}
.bottom {
  margin-top: 20px;
}
h2 {
  font-family: "Bold";
  color: #333;
  margin-bottom: 20px;
}
.file-input {
  display: block;
  margin: 0 auto 20px;
  padding: 10px;
  font-size: 16px;
  font-family: "Light";
  cursor: pointer;
}
.upload-button {
  padding: 10px 20px;
  background-color: #ff814b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Bold";
}
.upload-button:hover {
  background-color: #e0703b;
}
</style>
