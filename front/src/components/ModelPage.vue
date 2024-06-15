<template>
  <main>
    <div class="content">
      <div class="top">
        <img src="@/assets/egglogo.png" alt="Menu" class="egglogo-image" />
      </div>

      <div class="bottom">
        <h2>시간대별 이용률</h2>
        <input type="file" @change="onFileChange" />
        <button @click="uploadFile">파일 업로드 및 분석</button>
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
          "http://localhost:8080/predict",
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
main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
}
.content {
  text-align: center;
}
.top {
  margin: 30px;
  display: flex;
  justify-content: center;
}
.egglogo-image {
  width: 200px;
  height: auto;
  margin-bottom: 10px;
}
.bottom {
  margin-top: 30px;
}
button {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #ff814b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #e0703b;
}
</style>
