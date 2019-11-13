<?php

class modNotesItemGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'modNotesItem';
    public $classKey = 'modNotesItem';
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    //public $permission = 'list';


    /**
     * We do a special check of permissions
     * because our objects is not an instances of modAccessibleObject
     *
     * @return boolean|string
     */
    public function beforeQuery()
    {
        if (!$this->checkPermissions()) {
            return $this->modx->lexicon('access_denied');
        }

        return true;
    }

}

return 'modNotesItemGetListProcessor';