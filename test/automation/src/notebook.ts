/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';
import { QuickAccess } from './quickaccess';

const activeRowSelector = `.notebook-editor .monaco-list-row.focused`;

function wait(ms: number): Promise<void> {
	return new Promise(r => setTimeout(r, ms));
}

export class Notebook {

	constructor(
		private readonly quickAccess: QuickAccess,
		private readonly code: Code) {
	}

	async openNotebook() {
		console.log('open 1');
		await wait(1000);
		console.log('open 2');
		await this.quickAccess.runCommand('vscode-notebook-tests.createNewNotebook');
		console.log('open 3');
		await this.code.waitForElement('.notebook-editor .monaco-list-row');
		console.log('open 4');
		await wait(1000);
		// await this.focusFirstCell();
		// await this.waitForActiveCellEditorContents('code()');
		process.stdout.write('hello test\n');
	}

	async focusNextCell() {
		await this.code.dispatchKeybinding('down');
	}

	async focusFirstCell() {
		await this.quickAccess.runCommand('notebook.focusTop');
	}

	async editCell() {
		await this.code.dispatchKeybinding('enter');
	}

	async stopEditingCell() {
		await this.code.dispatchKeybinding('esc');
	}

	async waitForTypeInEditor(text: string): Promise<any> {
		const editor = `${activeRowSelector} .monaco-editor`;

		await this.code.waitForElement(editor);

		const textarea = `${editor} textarea`;
		await this.code.waitForActiveElement(textarea);

		await this.code.waitForTypeInEditor(textarea, text);

		await this._waitForActiveCellEditorContents(c => c.indexOf(text) > -1);
	}

	async waitForActiveCellEditorContents(contents: string): Promise<any> {
		return this._waitForActiveCellEditorContents(str => str === contents);
	}

	private async _waitForActiveCellEditorContents(accept: (contents: string) => boolean): Promise<any> {
		const selector = `${activeRowSelector} .monaco-editor .view-lines`;
		return this.code.waitForTextContent(selector, undefined, c => accept(c.replace(/\u00a0/g, ' ')));
	}

	async waitForMarkdownContents(markdownSelector: string, text: string): Promise<void> {
		const selector = `${activeRowSelector} .markdown ${markdownSelector}`;
		await this.code.waitForTextContent(selector, text);
	}

	async insertNotebookCell(kind: 'markdown' | 'code'): Promise<void> {
		if (kind === 'markdown') {
			await this.quickAccess.runCommand('notebook.cell.insertMarkdownCellBelow');
		} else {
			await this.quickAccess.runCommand('notebook.cell.insertCodeCellBelow');
		}
	}

	async deleteActiveCell(): Promise<void> {
		await this.quickAccess.runCommand('notebook.cell.delete');
	}

	async focusInCellOutput(): Promise<void> {
		await this.quickAccess.runCommand('notebook.cell.focusInOutput');
		await this.code.waitForActiveElement('webview, .webview');
	}

	async focusOutCellOutput(): Promise<void> {
		await this.quickAccess.runCommand('notebook.cell.focusOutOutput');
	}

	async executeActiveCell(): Promise<void> {
		await this.quickAccess.runCommand('notebook.cell.execute');
	}
}
