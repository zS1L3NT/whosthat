// ignore_for_file: avoid_print

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';

class App extends StatefulWidget {
  const App({super.key});

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
        Uri.parse("https://f5jzti57z1.execute-api.us-east-1.amazonaws.com/default"),
        body: {
          "area_id": "cf5c0a85-5aae-4147-a29a-68c6481f41e3",
        },
      );

      print(jsonDecode(response.body));
    } catch (e) {
      print(e);
    }

    Future.delayed(
      const Duration(seconds: 1),
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
