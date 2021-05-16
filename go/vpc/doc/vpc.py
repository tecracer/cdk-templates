# diagram.py
from diagrams import Diagram, Edge
from diagrams.aws.network import VPC
from diagrams.aws.management import ParameterStore 


with Diagram("VPC", show=False):
    VPC("vpc") >> Edge(label="VPCId") >> ParameterStore("/cdk-templates/go/vpc")