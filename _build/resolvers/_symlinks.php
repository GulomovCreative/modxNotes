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
        if (!is_link($dev . 'assets/components/modnotes')) {
            $cache->deleteTree(
                $dev . 'assets/components/modnotes/',
                ['deleteTop' => true, 'skipDirs' => false, 'extensions' => []]
            );
            symlink(MODX_ASSETS_PATH . 'components/modnotes/', $dev . 'assets/components/modnotes');
        }
        if (!is_link($dev . 'core/components/modnotes')) {
            $cache->deleteTree(
                $dev . 'core/components/modnotes/',
                ['deleteTop' => true, 'skipDirs' => false, 'extensions' => []]
            );
            symlink(MODX_CORE_PATH . 'components/modnotes/', $dev . 'core/components/modnotes');
        }
    }
}

return true;