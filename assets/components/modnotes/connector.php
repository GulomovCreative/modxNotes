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
/** @var modNotes $modNotes */
$modNotes = $modx->getService('modNotes', 'modNotes', MODX_CORE_PATH . 'components/modnotes/model/');
$modx->lexicon->load('modnotes:default');

// handle request
$corePath = $modx->getOption('modnotes_core_path', null, $modx->getOption('core_path') . 'components/modnotes/');
$path = $modx->getOption('processorsPath', $modNotes->config, $corePath . 'processors/');
$modx->getRequest();

/** @var modConnectorRequest $request */
$request = $modx->request;
$request->handleRequest([
    'processors_path' => $path,
    'location' => '',
]);