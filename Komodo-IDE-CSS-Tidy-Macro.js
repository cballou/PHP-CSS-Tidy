/**
 * A Komodo IDE / Edit macro for tidying up files. New addition for CSS.
 * 
 * @author Corey Ballou http://coreyballou.com <only added CSS modification>
 *
 * Credit to the original unknown author of this macro:
 * http://community.activestate.com/forum/format-document-script
 */
komodo.assertMacroVersion(3);
if (komodo.view.scintilla) {
    komodo.view.scintilla.focus();
} // bug 67103

var formatter;
var language = (komodo.document || komodo.koDoc).language;
switch (language) {
    case 'Perl':
        formatter = 'perltidy';
        break;
    case 'XML':
    case 'XUL':
    case 'XLST':
        formatter = 'tidy -q -xml -i -w 80';
        break;
    case 'HTML':
        formatter = 'tidy -q -asxhtml -i -w 80';
        break;
    case 'CSS':
        // http://www.if-not-true-then-false.com/2009/css-compression-with-own-php-class-vs-csstidy/
        formatter = 'php-css-tidy';
        break;
    default:
        alert("I don't know how to tidy " + language);
        exit(1);
}

// save current cursor position
var currentPos = komodo.editor.currentPos;

try {
    
    // Save the file.  After the operation you can check what changes where made by
    // File -> Show Unsaved Changes
    komodo.doCommand('cmd_save');

    // Group operations into a single undo
    komodo.editor.beginUndoAction();

    // Select entire buffer & pipe it into formatter.
    komodo.doCommand('cmd_selectAll');
    Run_RunEncodedCommand(window, formatter + " {'insertOutput': True, 'operateOnSelection': True}");

    // Restore cursor.  It will be close to the where it started depending on how the text was modified.
    komodo.editor.gotoPos(currentPos);

    // On windows, when the output of a command is inserted into an edit buffer it has unix line ends.
    komodo.doCommand('cmd_cleanLineEndings');
    
} catch (e) {
    alert(e);
} finally {
    // Must end undo action or may corrupt edit buffer
    komodo.editor.endUndoAction();
}
