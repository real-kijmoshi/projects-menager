const { exec, spawn } = require("child_process")
const { existsSync } = require("fs")
const { join } = require("path")
const DB = require("../db/database")
const db = new DB()

module.exports = cli => {
    cli
        .command("run")
        .argument("<command>", "comand to start eg. dev start")
        .argument("[project]", "id or name")
        .action((command, project, options) => {
            const path = db.getPath(project)
            
            console.log(join(path, ".proj"));

            if(!existsSync(join(path, ".proj", "run.json"))) {
                cli.error("missing " + "run.json")
            }

            const settings = require(join(path, ".proj", "settings.json"))
            const cmd = require(join(path, ".proj", "run.json"))[command]

            if(!cmd) {
                cli.error(`missing ${command} in ${path}`)
            }

            console.log(`\n\nusing ${command} from project ${settings.name}`)
            console.log("starting> " + cmd + "\n\n");
            const child = exec(cmd)
            
            child.stdout.on('data', (chunk) => {
                console.log(chunk);
            });

            child.on('close', (code) => {
              console.log(`\process exited with code ${code}`);
            });
        })
}