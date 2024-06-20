import json

def calculate_state(result_file_path, output_file_path):
    with open(result_file_path, 'r') as f:
        data = json.load(f)

    # 최신 데이터 10초의 결과를 사용
    recent_results = data['results'][-10:]

    Double_Seat = 0
    Four_Seat = 0
    Six_Seat = 0
    useable_TotalTable = 0
    useable_TotalChair = 0

    for result in recent_results:
        for group_name, group_data in result['groups'].items():
            if group_data['useable']:
                useable_TotalTable += group_data['table']
                useable_TotalChair += group_data['chair']
                if group_data['chair'] == 2:
                    Double_Seat += 1
                elif group_data['chair'] == 4:
                    Four_Seat += 1
                elif group_data['chair'] == 6:
                    Six_Seat += 1

    # 10초간의 평균값을 계산하여 정수형으로 표현
    flexible_results = {
        "useable_TotalTable": useable_TotalTable // 10,
        "useable_TotalChair": useable_TotalChair // 10,
        "Double_Seat": Double_Seat // 10,
        "Four_Seat": Four_Seat // 10,
        "Six_Seat": Six_Seat // 10
    }

    with open(output_file_path, 'w') as f:
        json.dump(flexible_results, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    result_file_path = 'result.json'
    output_file_path = 'FlexibleResult.json'
    calculate_state(result_file_path, output_file_path)
