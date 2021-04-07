import yaml
import json
import argparse
import sys
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--json', help='Input file (JSON)', required=True)
    parser.add_argument('--yaml', help='Output file (YAML)', required=True)
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit(1)
    args = parser.parse_args()
    json_file = args.json
    yaml_file = args.yaml
    with open(json_file) as fp:
        json = json.load(fp)
        with open(yaml_file, 'w') as yaml_fp:
            yaml.safe_dump(json, yaml_fp, allow_unicode=True, default_flow_style=False)
