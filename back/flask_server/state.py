import json

def calculate_state(result_file_path, output_file_path):
    with open(result_file_path, 'r') as f:
        data = json.load(f)

    # 마지막 1초의 결과를 사용
    last_result = data['results'][-1]

    Double_Seat = 0
    Four_Seat = 0
    Six_Seat = 0
    useable_TotalTable = 0
    useable_TotalChair = 0

    for group_name, group_data in last_result['groups'].items():
        if group_data['useable']:
            useable_TotalTable += group_data['table']
            useable_TotalChair += group_data['chair']
            if group_data['chair'] == 2:
                Double_Seat += 1
            elif group_data['chair'] == 4:
                Four_Seat += 1
            elif group_data['chair'] == 6:
                Six_Seat += 1

    data['useable_TotalTable'] = useable_TotalTable
    data['useable_TotalChair'] = useable_TotalChair
    data['Double_Seat'] = Double_Seat
    data['Four_Seat'] = Four_Seat
    data['Six_Seat'] = Six_Seat

    with open(output_file_path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    result_file_path = 'result.json'
    output_file_path = 'result.json'
    calculate_state(result_file_path, output_file_path)
