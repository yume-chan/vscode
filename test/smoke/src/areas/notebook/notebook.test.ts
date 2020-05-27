/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import { Application } from '../../../../automation';
import { describeRepeat } from '../../utils';

function wait(ms: number): Promise<void> {
	return new Promise(r => setTimeout(r, ms));
}


export function setup() {
	describe('Notebooks', () => {
		after(async function () {
			const app = this.app as Application;
			cp.execSync('git checkout . --quiet', { cwd: app.workspacePathOrFolder });
			cp.execSync('git reset --hard origin/master --quiet', { cwd: app.workspacePathOrFolder });
		});

		afterEach(async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.runCommand('workbench.action.files.save');
			await app.workbench.quickaccess.runCommand('workbench.action.closeActiveEditor');
		});

		it('inserts/edits code cell', async function () {
			const app = this.app as Application;
			await app.workbench.notebook.openNotebook();
		});

		it('inserts/edits markdown cell', async function () {
			const app = this.app as Application;
			await app.workbench.notebook.openNotebook();
			await app.workbench.notebook.focusNextCell();
		});

		it('moves focus as it inserts/deletes a cell', async function () {
			const app = this.app as Application;
			console.log('1');
			await app.workbench.notebook.openNotebook();
			console.log('2');
			await app.workbench.notebook.insertNotebookCell('code');
			console.log('3');
			await app.workbench.notebook.waitForActiveCellEditorContents(' ');
			console.log('4');
		});

		it('moves focus in and out of output', async function () {
			const app = this.app as Application;
			await app.workbench.notebook.openNotebook();
			await app.workbench.notebook.executeActiveCell();
			await app.workbench.notebook.focusInCellOutput();
			await app.workbench.notebook.focusOutCellOutput();
			await app.workbench.notebook.waitForActiveCellEditorContents('code()');
		});
	});
}
