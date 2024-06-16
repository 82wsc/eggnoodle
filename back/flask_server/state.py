import json

def calculate_useable_total_table(result_file_path):
    with open(result_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'results' not in data or not isinstance(data['results'], list):
        print("The result.json file does not contain a valid 'results' list.")
        return

    last_result = data['results'][-1]  # 가장 마지막 결과를 가져옴

    useable_TotalTable = sum(group['table'] for group in last_result['groups'].values() if group['useable'])
    
    data['useable_TotalTable'] = useable_TotalTable
    
    with open(result_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"Updated {result_file_path} with useable_TotalTable.")

def calculate_useable_total_chair(result_file_path):
    with open(result_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'results' not in data or not isinstance(data['results'], list):
        print("The result.json file does not contain a valid 'results' list.")
        return

    last_result = data['results'][-1]  # 가장 마지막 결과를 가져옴

    useable_TotalChair = sum(group['chair'] for group in last_result['groups'].values() if group['useable'])
    
    data['useable_TotalChair'] = useable_TotalChair
    
    with open(result_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"Updated {result_file_path} with useable_TotalChair.")

def calculate_seat_counts(result_file_path):
    with open(result_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'results' not in data or not isinstance(data['results'], list):
        print("The result.json file does not contain a valid 'results' list.")
        return

    last_result = data['results'][-1]  # 가장 마지막 결과를 가져옴

    Double_Seat = sum(1 for group in last_result['groups'].values() if group['useable'] and group['chair'] == 2)
    Four_Seat = sum(1 for group in last_result['groups'].values() if group['useable'] and group['chair'] == 4)
    Six_Seat = sum(1 for group in last_result['groups'].values() if group['useable'] and group['chair'] == 6)
    
    data['Double_Seat'] = Double_Seat
    data['Four_Seat'] = Four_Seat
    data['Six_Seat'] = Six_Seat
    
    with open(result_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"Updated {result_file_path} with seat counts.")

if __name__ == "__main__":
    result_file_path = 'result.json'
    calculate_useable_total_table(result_file_path)
    calculate_useable_total_chair(result_file_path)
    calculate_seat_counts(result_file_path)
