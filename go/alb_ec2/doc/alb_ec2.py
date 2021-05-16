from diagrams import Diagram, Edge
from diagrams.aws.compute import EC2,EC2AutoScaling
from diagrams.aws.network import ALB
from diagrams.aws.management import ParameterStore 
from diagrams.programming.language import Go

with Diagram("ALB-EC2"):
    alb = ALB("Load Balancer")
    asg = EC2AutoScaling("Autoscaling")
    ec2=EC2("web")

    alb >> asg >> ec2
    ps = ParameterStore("/cdk-templates/go/alb_ec2")
    alb >> Edge(label="LoadBalancerDnsName") >> ps

    ps >> Go("Test")
