// ignore_for_file: import_of_legacy_library_into_null_safe

import 'dart:convert';

import 'package:aws_iot_data_api/iot-data-2015-05-28.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:whosthat/env.dart';

class App extends StatefulWidget {
  const App({
    super.key,
    required this.iot,
  });

  final IoTDataPlane iot;

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  dynamic report;

  @override
  void initState() {
    super.initState();

    // publishLocation();
    getReports();
  }

  void getReports() async {
    try {
      final response = await post(
        Uri.parse(Env.AWS_LAMBDA_URL),
        headers: {
          "Content-Type": "application/json",
        },
        body: json.encode({
          "area_id": "cf5c0a85-5aae-4147-a29a-68c6481f41e3",
        }),
      );

      if (response.statusCode == 200) {
        final dynamic data = json.decode(response.body);

        if (data != null) {
          setState(() {
            print(data);
            report = null;
          });
        }
      }
    } catch (err) {
      print(err);
    }

    Future.delayed(
      const Duration(seconds: 5),
      getReports,
    );
  }

  void publishLocation() async {
    try {
      await widget.iot.publish(
        topic: "location",
        payload: Uint8List.fromList(
          jsonEncode({
            "user_id": "d8097ad2-fcfa-4846-a166-64ab94435ccf",
            "location": {
              "latitude": 0,
              "longitude": 0,
            },
          }).codeUnits,
        ),
      );
    } catch (err) {
      print(err);
    }

    Future.delayed(
      const Duration(seconds: 5),
      publishLocation,
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "WhosThat",
      home: Scaffold(
        body: Center(
          child: Text(report.toString()),
        ),
      ),
    );
  }
}
