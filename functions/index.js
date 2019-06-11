// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
/*const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();


const bigquery = require('@google-cloud/bigquery')();

var ndjson = require('ndjson')


exports.addToBigQuery = functions.storage.object().onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    console.log(`  Bucket: ${file.bucket}`);
    console.log(`  File: ${file.name}`);
    console.log(`  Metageneration: ${file.metageneration}`);
    console.log(`  Created: ${file.timeCreated}`);
    console.log(`  Updated: ${file.updated}`);
    console.log(`  Cotents: ${file}`);

    // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  // We add a '_output.flac' suffix to target audio file name. That's where we'll upload the converted audio.
  const targetTempFileName = fileName.replace(/\.[^/.]+$/, '') + '_ndjson.json';
  const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
  const targetStorageFilePath = path.join(path.dirname(filePath), targetTempFileName);

  await bucket.file(filePath).download({destination: tempFilePath});
  console.log('Audio downloaded locally to', tempFilePath);
  // Convert the audio to mono channel using FFMPEG.

    var json = JSON.parse(file.toString('utf8'))
    console.log(json)
    json.locations.forEach(function(location){
        console.log(location)
    })


/*
    // TODO: Make sure you set the `bigquery.datasetName` Google Cloud environment variable.
    const dataset = bigquery.dataset(functions.config().bigquery.datasetname);
    // TODO: Make sure you set the `bigquery.tableName` Google Cloud environment variable.
    const table = dataset.table(functions.config().bigquery.tablename);

  return table.insert({
    ID: snapshot.key,
    MESSAGE: snapshot.val().message,
    NUMBER: snapshot.val().number,
  });
  })*/
  