var spawn = require('child_process').spawn;
var runningProcess = null;


function start(args, binaryFile) {

  runningProcess = spawn(binaryFile, args || []);

  runningProcess.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  runningProcess.stderr.on('data', function(err) {
    console.log(err);
  });

  process.on('SIGINT', function() {
    runningProcess.kill('SIGTERM');
  });

  process.on('uncaughtException', function() {
    runningProcess.kill('SIGTERM');
  });
}


function close() {
  if (runningProcess) {
    runningProcess.kill('SIGTERM');
    runningProcess = null;
  }
}


function run(args, platform) {
  if (!platform) {
    platform = process.platform;
  }

  if (!args) {
    args = process.argv;
    args = args.splice(2);
  }

  var architecture = process.arch.substring(1);

  switch (platform) {

    case 'darwin':
      start(args, './osx');
      break;

    case 'freebsd':
      start(args, './linux' + architecture);
      break;

    case 'linux':
      start(args, './linux' + architecture);
      break;

    case 'sunos':
      start(args, './linux' + architecture);
      break;

    case 'win32':
      start(args, 'win.exe');
      break;

    default:
      throw new Error('Unsupported platform '+ platform +'.')

  }
}

run();

module.exports = {
  run: run,
  close: close
};