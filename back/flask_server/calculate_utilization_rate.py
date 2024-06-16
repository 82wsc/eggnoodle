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
        utilization_rates[f"{group_name}_Utilization_Rate"] = (counts['useable'] / counts['total']) * 100

    # Add the new utilization rates to the original data
    data['utilization_rates'] = utilization_rates

    with open(result_file_path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    result_file_path = 'result.json'
    calculate_group_utilization_rate(result_file_path)
<<<<<<< HEAD
=======

>>>>>>> 18d2d13b0072559da624cd1a7d710df038fb8e06
