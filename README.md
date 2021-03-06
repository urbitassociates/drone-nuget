# drone-nuget

[![Build Status](http://ci.urb-it.com/api/badges/urbitassociates/drone-nuget/status.svg)](http://ci.urb-it.com/urbitassociates/drone-nuget)
[![Docker Repository on Quay](https://quay.io/repository/urbit/drone-nuget/status "Docker Repository on Quay")](https://quay.io/repository/urbit/drone-nuget)

Drone plugin to publish files and artifacts to NuGet repository. For the usage information and a listing of the available options please take a look at [the docs](DOCS.md).

## White-listing
From the [Drone plugin developer documentation](http://readme.drone.io/0.4/devs/plugins/#custom-plugins):
>Custom Drone plugins also *must* be white-listed. The plugin white-list is provided to the Drone server using the `PLUGIN_FILTER` environment variable. This variables is a space-separated list of patterns for matching trusted plugins:

>`PLUGIN_FILTER=plugins/* quay.io/urbit/*`

## Execute

Install the deps using [npm](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) or [yarn](https://yarnpkg.com/en/docs/cli/install):

```
npm install
```
```
yarn
```

### Example

```sh
npm start <<EOF
{
    "repo": {
        "clone_url": "git://github.com/drone/drone",
        "owner": "drone",
        "name": "drone",
        "full_name": "drone/drone"
    },
    "system": {
        "link_url": "https://beta.drone.io"
    },
    "build": {
        "number": 22,
        "status": "success",
        "started_at": 1421029603,
        "finished_at": 1421029813,
        "message": "Update the Readme",
        "author": "johnsmith",
        "author_email": "john.smith@gmail.com",
        "event": "push",
        "branch": "master",
        "commit": "436b7a6e2abaddfd35740527353e78a227ddcb2c",
        "ref": "refs/heads/master"
    },
    "workspace": {
        "root": "/drone/src",
        "path": "/drone/src/github.com/drone/drone"
    },
    "vargs": {
        "source": "http://nuget.company.com",
        "api_key": "SUPER_KEY",
        "verbosity": "normal",
        "files": [
            "*.nupkg"
        ]
    }
}
EOF
```

## Docker

Build the container using [docker build](https://docs.docker.com/engine/reference/commandline/build/):

```
docker build -t quay.io/urbit/drone-nuget:latest .
```

### Example

```sh
docker run -i quay.io/urbit/drone-nuget <<EOF
{
    "repo": {
        "clone_url": "git://github.com/drone/drone",
        "owner": "drone",
        "name": "drone",
        "full_name": "drone/drone"
    },
    "system": {
        "link_url": "https://beta.drone.io"
    },
    "build": {
        "number": 22,
        "status": "success",
        "started_at": 1421029603,
        "finished_at": 1421029813,
        "message": "Update the Readme",
        "author": "johnsmith",
        "author_email": "john.smith@gmail.com",
        "event": "push",
        "branch": "master",
        "commit": "436b7a6e2abaddfd35740527353e78a227ddcb2c",
        "ref": "refs/heads/master"
    },
    "workspace": {
        "root": "/drone/src",
        "path": "/drone/src/github.com/drone/drone"
    },
    "vargs": {
        "source": "http://nuget.company.com",
        "api_key": "SUPER_KEY",
        "verbosity": "normal",
        "files": [
            "*.nupkg"
        ]
    }
}
EOF
```
