<?php
/** @var xPDOTransport $transport */
/** @var array $options */
/** @var modX $modx */
if ($transport->xpdo) {
    $modx =& $transport->xpdo;

    $dev = MODX_BASE_PATH . 'Extras/modNotes/';
    /** @var xPDOCacheManager $cache */
    $cache = $modx->getCacheManager();
    if (file_exists($dev) && $cache) {
        if (!is_link($dev . 'assets/components/modxnotes')) {
            $cache->deleteTree(
                $dev . 'assets/components/modxnotes/',
                ['deleteTop' => true, 'skipDirs' => false, 'extensions' => []]
            );
            symlink(MODX_ASSETS_PATH . 'components/modxnotes/', $dev . 'assets/components/modxnotes');
        }
        if (!is_link($dev . 'core/components/modxnotes')) {
            $cache->deleteTree(
                $dev . 'core/components/modxnotes/',
                ['deleteTop' => true, 'skipDirs' => false, 'extensions' => []]
            );
            symlink(MODX_CORE_PATH . 'components/modxnotes/', $dev . 'core/components/modxnotes');
        }
    }
}

return true;