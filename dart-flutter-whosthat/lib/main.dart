// ignore_for_file: import_of_legacy_library_into_null_safe

import 'package:aws_iot_data_api/iot-data-2015-05-28.dart';
import 'package:flutter/material.dart';
import 'package:whosthat/app.dart';

void main() async {
  runApp(
    App(
      iot: IoTDataPlane(
        region: "",
        endpointUrl: "",
        credentials: AwsClientCredentials(
          accessKey: "",
          secretKey: "",
        ),
      ),
    ),
  );
}
