// ignore_for_file: import_of_legacy_library_into_null_safe, depend_on_referenced_packages

import 'dart:convert';
import 'package:intl/intl.dart';

import 'package:aws_iot_data_api/iot-data-2015-05-28.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:timeago/timeago.dart';
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
  bool publish = false;

  @override
  void initState() {
    super.initState();

    publishLocation();
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
        final List reports = jsonDecode(response.body);
        reports.sort((a, b) => b["timestamp"] - a["timestamp"]);
        setState(() {
          report = reports.first;
        });
      } else {
        print(response.statusCode);
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
      if (publish) {
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
      }
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
      theme: ThemeData(
        primarySwatch: const MaterialColor(0xFFA4BE7B, {
          50: Color.fromRGBO(164, 190, 123, 0.1),
          100: Color.fromRGBO(164, 190, 123, 0.2),
          200: Color.fromRGBO(164, 190, 123, 0.3),
          300: Color.fromRGBO(164, 190, 123, 0.4),
          400: Color.fromRGBO(164, 190, 123, 0.5),
          500: Color.fromRGBO(164, 190, 123, 0.6),
          600: Color.fromRGBO(164, 190, 123, 0.7),
          700: Color.fromRGBO(164, 190, 123, 0.8),
          800: Color.fromRGBO(164, 190, 123, 0.9),
          900: Color.fromRGBO(164, 190, 123, 1.0),
        }),
        textTheme: const TextTheme(
          titleMedium: TextStyle(
            color: Color(0xFFDED3A6),
          ),
          bodySmall: TextStyle(
            color: Colors.white,
          ),
        ),
        cardColor: const Color(0xFF1E1E1E),
        scaffoldBackgroundColor: const Color(0xFF121212),
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text("Latest Report"),
        ),
        body: Column(
          children: [
            Card(
              child: ListTile(
                title: const Text("Area Name"),
                subtitle: Text(report != null ? report["area"]["name"] : "..."),
              ),
            ),
            Card(
              child: ListTile(
                title: const Text("Timestamp"),
                subtitle: Text(report != null
                    ? DateFormat("hh:mm:ss a, d MMMM y")
                        .format(DateTime.fromMillisecondsSinceEpoch(report["timestamp"]))
                    : "..."),
              ),
            ),
            Card(
              child: ListTile(
                title: const Text("Time Ago"),
                subtitle: Text(report != null
                    ? format(DateTime.fromMillisecondsSinceEpoch(report["timestamp"]))
                    : "..."),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: SizedBox(
                width: double.infinity,
                child: report != null ? Image.network(report["feed_url"]) : null,
              ),
            ),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  publish = !publish;
                });
              },
              child: Text(
                publish ? "Disable Location Publishing" : "Enable Location Publishing",
              ),
            )
          ],
        ),
      ),
    );
  }
}
