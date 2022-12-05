// ignore_for_file: import_of_legacy_library_into_null_safe

import 'dart:convert';

import 'package:aws_iot_data_api/iot-data-2015-05-28.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart';

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
  @override
  void initState() {
    super.initState();

    getReports();
  }

  void getReports() async {
    try {
      final response = await post(
        Uri.parse(""),
        headers: {
          "Content-Type": "application/json",
        },
        body: json.encode({
          "area_id": "cf5c0a85-5aae-4147-a29a-68c6481f41e3",
        }),
      );

      print(jsonDecode(response.body));
    } catch (e) {
      print(e);
    }

    Future.delayed(
      const Duration(seconds: 5),
      getReports,
    );
  }

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: "WhosThat",
    );
  }
}
