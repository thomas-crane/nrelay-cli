# nrelay-cli

A command line interface for generating and running nrelay projects.

## Contents

+ [Install](#install)
+ [Commands](#commands)
  + [new](#new)
  + [run](#run)
  + [build](#build)
  + [eject](#eject)

## Install

```no-lang
npm install -g nrelay-cli
```

## Commands

Running nrelay with no commands will print the help information.

### new

The new command can be used to generate a new nrelay project. It requires a single argument which is the name of the project that will be generated. The new project will be created in a folder in the current working directory of the console.

```no-lang
nrelay new my-new-project
```

Creates a new folder in the current working directory of the console called `my-new-project`.

### run

The run command is used to actually run an nrelay project. Any arguments which are provided will be passed on to the nrelay runtime which is created.

```no-lang
nrelay run
```

Runs the project with no arguments.

```no-lang
nrelay run --no-update
```

Runs the project and doesn't check for any updates when starting up.

### build

The build command is simply used to build the current nrelay project. This is just an alias for `npm run compile`.

```no-lang
nrelay build
```

Builds the project.

### eject

The eject command can be used to modify an existing nrelay project such that it can be run independently of the CLI. This command is extremely useful when you intend to host an nrelay project, since it removes the dependency on the CLI.

```no-lang
nrelay eject
```

Ejects the nrelay project. An ejected project can be run by using

```no-lang
node index
```

Instead of the usual run command (the run command will still work, though).
