#!/usr/bin/env node

import { Runner } from '../Runner';

const runner = new Runner();
runner.start(process.argv);
