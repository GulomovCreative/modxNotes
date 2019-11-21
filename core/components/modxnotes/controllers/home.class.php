<?php

/**
 * The home manager controller for modxNotes.
 *
 */
class modxNotesHomeManagerController extends modExtraManagerController
{
    /** @var modxNotes $modxNotes */
    public $modxNotes;


    /**
     *
     */
    public function initialize()
    {
        $this->modxNotes = $this->modx->getService('modxNotes', 'modxnotes', MODX_CORE_PATH . 'components/modxnotes/model/');
        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return ['modxnotes:default'];
    }


    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }


    /**
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('modxnotes');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addCss($this->modxNotes->config['cssUrl'] . 'mgr/main.css');

        $this->addHtml('<script type="text/javascript">
        var modxNotes = {
            config: ' . json_encode($this->modxNotes->config) . '
        }
        modxNotes.config.http_modauth = "' . $this->modx->user->getUserToken($this->modx->context->get('key')) . '";
        Ext.onReady(function() {modxNotes.init();});
        </script>');

        $this->addLastJavascript($this->modxNotes->config['jsUrl'] . 'mgr/misc/strftime.min.js');
        $this->addLastJavascript($this->modxNotes->config['jsUrl'] . 'mgr/modxnotes.events.js');
        $this->addLastJavascript($this->modxNotes->config['jsUrl'] . 'mgr/modxnotes.utils.js');
        $this->addLastJavascript($this->modxNotes->config['jsUrl'] . 'mgr/modxnotes.ajax.js');
        $this->addLastJavascript($this->modxNotes->config['jsUrl'] . 'mgr/modxnotes.js');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        $this->content .= '<div id="modxnotes-panel-home-div"></div>';

        return '';
    }
}