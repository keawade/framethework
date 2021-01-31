import { IContext } from './IContext';

export interface IActionContext<Params = unknown> extends IContext {
  actionName: string;
  params: Params;
}
