<?php
if (file_exists(dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php')) {
    /** @noinspection PhpIncludeInspection */
    require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
} else {
    require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
}
/** @noinspection PhpIncludeInspection */
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
/** @noinspection PhpIncludeInspection */
require_once MODX_CONNECTORS_PATH . 'index.php';
/** @var modxNotes $modxNotes */
$modxNotes = $modx->getService('modxNotes', 'modxnotes', MODX_CORE_PATH . 'components/modxnotes/model/');
$modx->lexicon->load('modxnotes:default');

// handle request
$corePath = $modx->getOption('modxNotes_core_path', null, $modx->getOption('core_path') . 'components/modxnotes/');
$path = $modx->getOption('processorsPath', $modxNotes->config, $corePath . 'processors/');
$modx->getRequest();

/** @var modConnectorRequest $request */
$request = $modx->request;
$request->handleRequest([
    'processors_path' => $path,
    'location' => '',
]);