# 🍳매장 내 실시간 잔여 좌석 탐지 시스템🍳🥚

## 개요
현대인들은 불필요한 이동과 대기 시간을 줄이는 것을 선호합니다. 이에 따라 식당 예약 관련 서비스가 인기를 끌고 있으나, 몇 인용 테이블이 비어 있는지 알 수 없는 불편함이 있습니다. 본 연구는 매장 내 CCTV 영상 데이터를 활용하여 빈 좌석 수와 테이블 종류를 실시간으로 확인할 수 있는 시스템을 개발하고자 합니다.

## 팀 구성
- 지도교수: 김민수 교수님
- 팀명: 시나브로 (5조)
- 구성원:
  - 김주희 (기술·데이터공학)
  - 박지연 (산업·경영공학)
  - 서민지 (기술·데이터공학)
  - 조승원 (기술·데이터공학)
  - 정수환 (기술·데이터공학, 팀)

## 연구 필요성
현재 시중에 서비스되고 있는 식당 예약 앱 '캐치테이블'이나 '테이블링'의 경우, 빈 좌석 여부만 확인이 가능하고 정확히 몇 인용 테이블이 비어있는지는 매장을 직접 들어가보지 않고는 알 수 없습니다. 이러한 불편함은 2층 이상에 위치한 식당을 방문하는 고객들에게 불필요한 이동을 요구하며, 해당 식당을 피하려는 경향이 있습니다. 따라서 외부나 1층에서 빈 좌석 수와 몇 인용 테이블이 비어 있는지 여부를 확인할 수 있다면 고객의 시간을 절약하고, 빈 좌석이 없어 다시 밖으로 나가야 하는 불편함을 줄일 수 있습니다.

특히 대학 인근 매장에 빈 좌석 확인 시스템을 도입하게 된다면, 많은 사람들이 몰리는 점심시간에 매장 내부로 들어가지 않고 외부에서 빈 좌석을 실시간으로 확인할 수 있어 매장을 더욱 쾌적하게 유지할 수 있습니다. 매장 관리자의 경우, 실시간으로 매장 내 좌석과 관련된 정보를 제공받음으로써 매장 운영의 효율성을 증대시킬 수 있습니다. 이러한 정보는 매장 관리를 보다 효과적으로 할 수 있게 하여, 매출 증대에도 긍정적인 영향을 미칠 것으로 기대됩니다.

## 연구 목표
- 매장 내 기존 설치된 CCTV 영상 데이터를 활용하여 테이블별 고객의 존재 여부를 탐지하고, 사용 가능한 테이블 수와 의자 수가 몇 개인지, 좌석이 몇 인석인지의 정보를 제공하고자 합니다.
- 영상 데이터 분석 결과를 이용하여 전략적 매장 운영을 위한 자리별 점유율, 좌석 선호도, 시간대별 이용률 등의 정보를 정량적인 수치로 도출하고자 합니다.
- 실시간으로 정보가 특정 시간 간격으로 업데이트 되어 매장과 소비자 사이의 정보의 리드타임을 최소화하고자 합니다.
- 최종적으로 관리자와 매장 내 손님, 매장 밖 잠재 손님까지 모두에게 유의미한 정보를 제공하며 전략적인 매장 운영을 위한 정보를 제공하고자 합니다.

## 연구 방법
### 데이터 수집 및 처리
- **CCTV 영상 데이터 수집**: 매장에 설치된 CCTV에서 영상 데이터를 수집하고, n초 단위로 분할하여 이미지로 변환합니다.
- **데이터 전처리**: 'Labelimg' 프로그램을 사용하여 테이블, 의자, 사람에 대한 바운딩 박스 처리를 수행합니다.
- **데이터 증강**: 'albumentations' 라이브러리를 사용하여 수직과 수평 5:5로 데이터를 2배수까지 증강시켜 모델 설계 및 학습에 사용합니다.

### 딥러닝 모델 설계 및 학습
- **모델 선택**: YOLOv8n 모델을 선택하였으며, 이는 실시간 처리가 가능하고 훈련 단계에서 본 적 없는 새로운 이미지에 대한 검출 정확도가 뛰어납니다.
- **모델 학습**: 수집된 데이터를 이용하여 YOLOv8n 모델을 학습시킵니다. 100 에포크 동안 학습을 진행하고, 과적합을 방지하기 위해 그리드 서치를 통해 최적의 파라미터 값을 도출합니다.
- **파라미터 최적화**: 'L2 규제화'와 '드롭아웃'을 적용하여 모델 과적합을 방지하고, 다양한 조합을 통해 최적의 성능을 도출합니다.
- **모델 성능 평가**: 여러 지표 (precision, recall, map50, map50_95, val/box_loss, val/cls_loss, val/dfl_loss)를 통해 모델 성능을 평가하고, 최종적으로 가장 성능이 좋은 모델을 선택합니다.

### 실시간 탐지 결과 및 웹 개발
- **웹 애플리케이션 개발**: '웹 프로그래밍' 과목에서 배운 지식을 활용하여 사용자에게 적합한 결과를 전달하는 직관적인 웹 앱을 제작합니다. Vue.js를 사용하여 프론트엔드를 구현하고, Node.js를 사용하여 백엔드 서버를 구축합니다.
- **실시간 객체 탐지**: Flask 서버를 통해 실시간으로 객체를 탐지하고, 결과를 웹 애플리케이션에 전달합니다. 각 테이블이 비어 있는지, 사용 중인지 판단하여 결과를 도출합니다.
- **데이터 시각화**: 관리자용 화면에서는 누적 좌석 이용률과 좌석 선호도 등의 정보를 제공하여 매장을 효율적으로 운영할 수 있도록 지원하며, 고객용 화면에서는 빈 테이블의 개수를 실시간으로 제시하여 예비 고객의 불필요한 이동을 줄이고 시간 관리에 도움을 줍니다.

## 연구 추진 경과
- 2024.03.28 ~ 2024.04.16: 데이터 수집
- 2024.04.17 ~ 2024.05.10: 데이터 처리 및 모델 개발
- 2024.05.11 ~ 2024.05.31: 모델 수정 및 학습 수행
- 2024.06.01 ~ 2024.06.15: 모델 수정 및 웹 개발
- 2024.06.15 ~ 2024.06.23: 결과 도출 및 웹 연결

## 연구 결과
### 모델 성능
YOLOv8n 모델을 사용하여 학습을 진행한 결과, 다양한 지표를 통해 성능을 평가했습니다. 주요 성능 지표는 다음과 같습니다:

- **Precision (정밀도)**: 0.91503
- **Recall (재현율)**: 0.95373
- **mAP50**: 0.96534
- **mAP50-95**: 0.6449
- **Train Box Loss**: 0.79763
- **Train Class Loss**: 0.44306
- **Train DFL Loss**: 0.96006
- **Validation Box Loss**: 1.0702
- **Validation Class Loss**: 0.49326
- **Validation DFL Loss**: 1.0716

학습 결과, Epoch 59에서 가장 좋은 성능을 보였으며, 특히 recall과 mAP50 값이 높은 것으로 나타났습니다. 이 모델은 실시간 객체 탐지에서 높은 정밀도와 재현율을 나타내어, 매장 내 빈 좌석 탐지에 효과적으로 활용될 수 있습니다.


### 구현 결과
- 프론트엔드: Vue.js
- 백엔드: Node.js, Flask 서버
- 실시간 탐지를 위한 객체 그룹화 및 결과 도출
- 웹 애플리케이션을 통한 실시간 정보 제공

