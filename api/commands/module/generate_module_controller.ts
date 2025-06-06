import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const STUBS_ROOT = new URL('./stubs', import.meta.url)
export default class MakeModuleController extends BaseCommand {
  static commandName = 'generate:controller'
  static aliases = ['g:controller']
  static description = 'Generate a controller in given module'

  static options: CommandOptions = {}

  @args.string()
  declare name: string

  async run() {
    const availableModuleNames = await readdir(join(process.cwd(), 'apps'))
    const module = await this.prompt.choice('Choose your module', availableModuleNames)

    const codemods = await this.createCodemods()
    await Promise.all([
      codemods.makeUsingStub(STUBS_ROOT.pathname, 'controller.stub', {
        name: this.name,
        module,
        includeServiceInjection: false,
      }),
    ])
  }
}
