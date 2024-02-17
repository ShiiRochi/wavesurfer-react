const core = require('@actions/core');
const exec = require('@actions/exec');

function run() {
    // get some inputs
    const bucket$ = core.getInput('bucket', { required: true });
    const bucketRegion$ = core.getInput('bucket-region', { required: true });
    const dist$ = core.getInput('dist-folder', { required: true });



    // upload to S3
    const s3URI = `s3://${bucket$}`;

    exec.exec(`aws s3 sync ${dist$} ${s3URI} --region ${bucketRegion$} --endpoint-url=https://storage.yandexcloud.net`)

    const website$ = `https://${bucket$}.website.yandexcloud.net`;
    core.setOutput('website-url', website$);
}

run();
