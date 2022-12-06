// ignore_for_file: import_of_legacy_library_into_null_safe

import 'package:aws_iot_data_api/iot-data-2015-05-28.dart';
import 'package:flutter/material.dart';
import 'package:whosthat/app.dart';
import 'package:whosthat/env.dart';

void main() async {
  runApp(
    App(
      iot: IoTDataPlane(
        region: Env.AWS_REGION,
        endpointUrl: Env.AWS_IOT_ENDPOINT_URL,
        credentials: AwsClientCredentials(
          accessKey: Env.AWS_ACCESS_KEY,
          secretKey: Env.AWS_SECRET_ACCESS_KEY,
        ),
      ),
    ),
  );
}
