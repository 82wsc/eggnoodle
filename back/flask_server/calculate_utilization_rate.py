import json

def calculate_group_utilization_rate(result_file_path):
    with open(result_file_path, 'r') as f:
        data = json.load(f)

    group_utilization = {}
    total_seconds = len(data['results'])

    for result in data['results']:
        for group_name, group_data in result['groups'].items():
            simple_group_name = group_name.split('_')[1]  # 'Group_1' -> '1'
            if simple_group_name not in group_utilization:
                group_utilization[simple_group_name] = {'useable': 0, 'total': 0}
            if not group_data['useable']:
                group_utilization[simple_group_name]['useable'] += 1
            group_utilization[simple_group_name]['total'] += 1

    utilization_rates = {}
    for group_name, counts in group_utilization.items():
        utilization_rates[f"{group_name}_Utilization_Rate"] = round((counts['useable'] / counts['total']) * 100, 1)

    # Calculate Two_Seat_Utilization_Rate and Four_Seat_Utilization_Rate
    two_seat_utilization_useable = 0
    four_seat_utilization_useable = 0
    total_useable = 0

    for group_name, counts in group_utilization.items():
        group_id = int(group_name)
        useable_count = counts['useable']
        if group_id in [1, 2, 3, 4]:
            two_seat_utilization_useable += useable_count
        elif group_id in [5, 6]:
            four_seat_utilization_useable += useable_count
        total_useable += useable_count

    # Calculate the utilization rates
    if total_useable > 0:
        two_seat_utilization_rate = round((two_seat_utilization_useable / total_useable) * 100, 1)
        four_seat_utilization_rate = round((four_seat_utilization_useable / total_useable) * 100, 1)
    else:
        two_seat_utilization_rate = 0
        four_seat_utilization_rate = 0

    data['Two_Seat_Utilization_Rate'] = two_seat_utilization_rate
    data['Four_Seat_Utilization_Rate'] = four_seat_utilization_rate

    # Add the new utilization rates to the original data
    data['utilization_rates'] = utilization_rates

    with open(result_file_path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    result_file_path = 'result.json'
    calculate_group_utilization_rate(result_file_path)
