import * as request from "request-promise-native";

export async function GetLocalIp() : Promise<string> {
    var clientIp: string;
    const baseUrl = 'http://checkip.amazonaws.com/';

    var options = {
        uri: baseUrl,
    };

    var result = await request.get(options);
    if(result.indexOf(",") > -1) {
        var arr = result.split(",");
        result = arr[1]

    }
    clientIp = result.trim()+"/32";

    return clientIp;

}