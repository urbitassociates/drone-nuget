const path    = require('path');
const shelljs = require('shelljs');
const Drone   = require('drone-node');
const Nuget   = require('nuget-runner');

const plugin  = new Drone.Plugin();

/**
 * Plugin entrypoint
 */
plugin.parse().then((params) => {
  // gets build, repository, workspace and plugin-specific params for the current running build
  const { build, repo, workspace, vargs } = params;

  vargs.verbosity = vargs.verbosity || 'quiet';
  vargs.files = vargs.files || [];

  uploadPackage(workspace, vargs);
});

/**
 * Upload the NuGet package
 *
 * @param workspace
 * @param vargs
 */
const uploadPackage = (workspace, vargs) => {
    if (!vargs.source) {
        console.error("Parameter missing: NuGet source URL");
        process.exit(1);
    }

    const nugetPath = '/usr/lib/nuget/NuGet.exe';
    const nuget = new Nuget({
        apiKey: vargs.api_key,
        verbosity: vargs.verbosity,
        nugetPath: nugetPath
    });

    const nugetVersion = shelljs.exec('mono ' + nugetPath, {silent:true}).head({'-n': 1}).stdout;
    console.log(nugetVersion);

    const resolvedFiles = [].concat.apply([], vargs.files.map((f) => { return shelljs.ls(workspace.path + '/' + f); }));
    resolvedFiles.forEach((file) => {
        if (path.extname(file) === '.nuspec') {
            packThenPushPackage(nuget, workspace, vargs, file);
        } else {
            pushPackage(nuget, workspace, vargs, file);
        }
    });
};

/**
 * Packs then pushes the NuGet package to the NuGet or MyGet repo
 *
 * @param nuget
 * @param workspace
 * @param vargs
 * @param file
 */
const packThenPushPackage = (nuget, workspace, vargs, file) => {
    console.log('Start packing ' + file);
    nuget.pack({
        spec: file,
        outputDirectory: path.dirname(file)
    }).then((stdout) => {
        console.log('Successfully packed ' + file);

        const packagePath = file.replace('.nuspec', '*.nupkg')
        const resolvedPackageFile = shelljs.ls(packagePath)
        pushPackage(nuget, workspace, vargs, resolvedPackageFile[0]);
    }).catch((err) => {
        console.error('An error happened while packing: ' + err);
        process.exit(1);
    });
};

/**
 * Pushes the NuGet package to the NuGet or MyGet repo
 *
 * @param nuget
 * @param workspace
 * @param vargs
 * @param file
 */
const pushPackage = (nuget, workspace, vargs, file) => {
  const relativePath = path.relative('.', file);

  console.log('Start pushing ' + file);
  nuget.push(relativePath, {
    source: vargs.source
  }).then((stdout) => {
   console.log('Successfully pushed ' + file);
  }).catch(err => {
    console.error('An error happened while pushing: ' + err);
    process.exit(1);
  });
};
