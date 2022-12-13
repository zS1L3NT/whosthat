# WhosThat

![License](https://img.shields.io/github/license/zS1L3NT/whosthat?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/whosthat?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/whosthat?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/whosthat?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/whosthat?style=for-the-badge)

A very scuffed usage of AWS Cloud to build an extremely simple security system that probably shouldn't be used in production.

The simple idea is that you should have many areas registered with this system. Each area can have multiple cameras and multiple users authorized to be in the area. These users could be security guards or administrators. The location of these users will be constantly sent out from their device via MQTT to IoT Core so it knows where they are (near or away from the area).

If one of the cameras detect motion, it will capture the current camera feed and upload it to the S3 bucket. This should by right trigger a Lambda to check for people in the camera feed.

If all users are outside the area AND there are people detected in the camera feed, SNS will send an email to a registered email address to alert them of unauthorized precense in the area. The Lambda will also capture all the information and upload it to DynamoDB for tracking purposes.

![WhosThat Cloud Architecture Diagram](https://res.cloudinary.com/zs1l3nt/image/upload/repositories/whosthat/diagram.png)

## Motivation

I need a deliverable for my school subject called IoT Application Development (ITAD)

## Subrepositories

### [`dart-flutter-whosthat`](dart-flutter-whosthat)

This is the the Flutter app that runs on the user's device as the IoT Device

### [`ts-lambda-whosthat`](ts-lambda-whosthat)

This is the AWS Lambda function's code

### [`web-react-whosthat`](web-react-whosthat)

This is the React frontend testing dashboard built for the live demonstration of WhosThat

## Usage

### Setup the AWS Project

Good luck... <br>
[AWS-Setup.md](AWS-Setup.md)

### Setup the Flutter project

Copy the `env.example.dart` file to `env.dart` then fill in the correct project credentials

```
$ flutter pub get
$ flutter run --no-sound-null-safety
```

### Setup the React frontend

Copy the `.env.example` file to `.env` then fill in the correct project credentials

```
$ npm i
$ npm run dev
```

## Credits

@rxtay for the extensive help on AWS Cloud Infrastructure

## Built with

-   Amazon Web Services
    -   IoT Core
    -   DynamoDB
    -   Lambda
    -   S3 Bucket
    -   API Gateway
    -   Simple Notification Service
    -   Rekognition
-   Lambda
    -   TypeScript
        -   [![@types/aws-lambda](https://img.shields.io/badge/%40types%2Faws--lambda-%5E8.10.108-red?style=flat-square)](https://npmjs.com/package/@types/aws-lambda/v/8.10.108)
        -   [![@types/node](https://img.shields.io/badge/%40types%2Fnode-latest-red?style=flat-square)](https://npmjs.com/package/@types/node/v/latest)
        -   [![ts-node](https://img.shields.io/badge/ts--node-latest-red?style=flat-square)](https://npmjs.com/package/ts-node/v/latest)
        -   [![typescript](https://img.shields.io/badge/typescript-latest-red?style=flat-square)](https://npmjs.com/package/typescript/v/latest)
    -   AWS SDK
        -   [![aws-lambda](https://img.shields.io/badge/aws--lambda-%5E1.0.7-red?style=flat-square)](https://npmjs.com/package/aws-lambda/v/1.0.7)
        -   [![aws-sdk](https://img.shields.io/badge/aws--sdk-%5E2.1258.0-red?style=flat-square)](https://npmjs.com/package/aws-sdk/v/2.1258.0)
-   Flutter
    -   AWS SDK
        -   [![aws_iot_data_api](https://img.shields.io/badge/aws__iot__data__api-%5E0.2.0-blue?style=flat-square)](https://pub.dev/packages/aws_iot_data_api/versions/0.2.0)
    -   Miscellaneous
        -   [![flutter_lints](https://img.shields.io/badge/flutter__lints-%5E2.0.0-blue?style=flat-square)](https://pub.dev/packages/flutter_lints/versions/2.0.0)
        -   [![geolocator](https://img.shields.io/badge/geolocator-%5E9.0.2-blue?style=flat-square)](https://pub.dev/packages/geolocator/versions/9.0.2)
        -   [![http](https://img.shields.io/badge/http-%5E0.12.0-blue?style=flat-square)](https://pub.dev/packages/http/versions/0.12.0)
        -   [![timeago](https://img.shields.io/badge/timeago-%5E3.2.2-blue?style=flat-square)](https://pub.dev/packages/timeago/versions/3.2.2)