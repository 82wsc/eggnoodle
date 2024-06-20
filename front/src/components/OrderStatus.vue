<template>
  <main>
    <div class="content">
      <div class="top">
        <img src="@/assets/egglogo.png" alt="Menu" class="egglogo-image" />
        <div class="time">
          기준 시간&emsp;&emsp;<span class="StandardTime">{{ runTime }}</span>
        </div>
      </div>
      <div class="middle1">
        <div class="tables">
          <div v-for="(rate, group) in tables" :key="group" class="table">
            <h3>
              Table <span class="coco2">{{ group }} </span> :
            </h3>
            <br />
            <span class="coco3">{{ rate }}</span> %
          </div>
        </div>
        <img src="@/assets/arrow2.png" class="arrow2" />
        <div class="middle2">
          <div class="info">
            <h1>좌석 선호도</h1>
            <br />
            <img src="@/assets/egg2.png" class="egg2" />
            최다 이용 테이블 : &ensp;<span class="coco">{{ besttable }}</span
            >&ensp;번 테이블 <br /><br />
            <img src="@/assets/egg2.png" class="egg2" />
            최소 이용 테이블 : &ensp;<span class="coco">{{ leasttable }}</span
            >&ensp;번 테이블
          </div>
          <div class="preference">
            <h1>좌석 선호도</h1>
            <br />
            <img src="@/assets/egg2.png" class="egg2" />
            4인좌석 이용률 : &ensp;<span class="coco">{{ fourSeatRate }}</span>
            % <br /><br />
            <img src="@/assets/egg2.png" class="egg2" />
            2인좌석 이용률 : &ensp;<span class="coco">{{ twoSeatRate }}</span> %
          </div>
        </div>
      </div>
      <div class="middle3">
        <img src="@/assets/arrow.png" class="arrow" />
        <h4>일별 기준 시간까지의 각 테이블 누적 이용률</h4>
      </div>
      <div class="bottom">
        <h2>시간대별 이용률</h2>
        <br />
        <img src="@/assets/egg3.png" class="egg2" />
        오픈 (10:30~12:00) :&ensp;<span class="coco">{{ open }}</span> %
        <span class="spacer"></span>
        <img src="@/assets/egg3.png" class="egg2" />
        미들 (12:00~16:00) :&ensp;<span class="coco">{{ middle }}</span> %
        <span class="spacer"></span>
        <img src="@/assets/egg3.png" class="egg2" />
        마감 (16:00~20:30) :&ensp;<span class="coco">{{ last }}</span> %
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      runTime: "",
      tables: {},
      besttable: null,
      leasttable: null,
      fourSeatRate: null,
      twoSeatRate: null,
      open: null,
      middle: null,
      last: null,
    };
  },
  mounted() {
    this.fetchStatus();
    setInterval(this.fetchStatus, 300000); // 5분마다 데이터 업데이트
  },
  methods: {
    fetchStatus() {
      fetch("http://localhost:3000/api/status")
        .then((response) => response.json())
        .then((data) => {
          this.runTime = data.run_time; // 모델 실행 시간 추가
          this.tables = this.formatUtilizationRates(data.fix.utilization_rates);
          this.besttable = this.getBestTable(data.fix.utilization_rates);
          this.leasttable = this.getLeastTable(data.fix.utilization_rates);
          this.fourSeatRate = data.fix.Four_Seat_Utilization_Rate.toFixed(1);
          this.twoSeatRate = data.fix.Two_Seat_Utilization_Rate.toFixed(1);
          this.open = data.flexible.useable_TotalTable;
          this.middle = data.flexible.Double_Seat;
          this.last = data.flexible.Six_Seat;
        })
        .catch((error) => console.error("상태 정보 가져오기 에러:", error));
    },
    formatUtilizationRates(utilization_rates) {
      const formattedRates = {};
      for (const [key, value] of Object.entries(utilization_rates)) {
        formattedRates[key.replace("_Utilization_Rate", "")] = value.toFixed(1);
      }
      return formattedRates;
    },
    getBestTable(utilization_rates) {
      let bestTable = "";
      let maxRate = -1;
      for (const [key, value] of Object.entries(utilization_rates)) {
        if (value > maxRate) {
          maxRate = value;
          bestTable = key.replace("_Utilization_Rate", "");
        }
      }
      return bestTable;
    },
    getLeastTable(utilization_rates) {
      let leastTable = "";
      let minRate = 101;
      for (const [key, value] of Object.entries(utilization_rates)) {
        if (value < minRate) {
          minRate = value;
          leastTable = key.replace("_Utilization_Rate", "");
        }
      }
      return leastTable;
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
  min-height: 200px;
  background-color: #f9f9f9;
}
.content {
  text-align: center;
  margin-bottom: 4pc;
}
.top {
  margin: 30px;
  display: inline-flex;
  gap: 100px;
}
.egglogo-image {
  width: 200px;
  height: auto;
  margin-bottom: 10px;
}
.time {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-block: auto;
  margin-left: 70px;
  width: auto;
  padding: 15px;
  font-family: "Bold";
  background-color: white;
  border-radius: 10px;
  font-size: 17px;
  box-shadow: 5px 5px 5px #cacaca;
  white-space: nowrap; /* Prevent the text from wrapping */
}

.coco {
  color: #ff814b;
  width: flex;
}
.StandardTime {
  color: #ff814b;
  width: flex;
  justify-content: center;
}
.middle1 {
  display: flex;
  justify-content: center;
  gap: 60px;
}
.info {
  margin: auto;
  margin-bottom: 20px;
  padding: 20px;
  font-family: "Light";
  font-weight: bold;
  background-color: white;
  border-radius: 10px;
  font-size: 17px;
  box-shadow: 5px 5px 5px #cacaca;
}
.preference {
  margin: auto;
  margin-bottom: 20px;
  padding: 20px;
  font-family: "Light";
  font-weight: bold;
  background-color: white;
  border-radius: 10px;
  font-size: 17px;
  box-shadow: 5px 5px 5px #cacaca;
}

.tables {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
}

.table {
  border: 4px solid #ff814b;
  padding: 12px;
  border-radius: 10px;
}
.coco2 {
  color: #ff814b;
  font-size: 13px;
  font-family: "Light";
}
.coco3 {
  color: #ff814b;
  font-size: 17px;
  font-family: "Bold";
}
.middle3 {
  display: inline-flex;
}
.arrow {
  width: 11px;
  height: 11px;
  margin-left: -21pc;
  margin-top: -15px;
  margin-right: 5px;
}
h4 {
  font-size: 11px;
  font-family: "Light";
  margin-top: -15px;
  margin-bottom: 20px;
}
.arrow2 {
  width: 35px;
  height: 35px;
  margin-top: 50px;
}
.bottom {
  margin-top: 30px;
  padding: 12px;
  font-family: "Light";
  background-color: white;
  border-radius: 10px;
  font-size: 17px;
  box-shadow: 5px 5px 5px #cacaca;
  font-weight: bold;
}
.spacer {
  display: inline-block;
  width: 55px;
}
h1 {
  font-size: 20px;
  font-family: "Bold";
  margin-top: -5px;
  margin-bottom: -5px;
  text-align: left;
}
h2 {
  font-size: 20px;
  font-family: "Bold";
  margin-top: 5px;
  margin-left: 15px;
  margin-bottom: -8px;
  text-align: left;
}
h3 {
  font-size: 10px;
  font-family: "Light";
  margin-top: 0px;
  margin-right: 30px;
  margin-bottom: -10px;
  text-align: left;
}
.egg2 {
  width: 20px;
  height: auto;
  margin-top: -3px;
  margin-bottom: -4px;
  margin-right: 3px;
}
</style>
