<?php
class modxNotesItemSortProcessor extends modObjectProcessor
{
    public $objectType = 'modxNotesItem';
    public $classKey = 'modxNotesItem';
    public $beforeSaveEvent = 'mnOnBeforeUpdateNote';
    public $afterSaveEvent = 'mnOnUpdateNote';


    /**
     * @return array|string
     */
    public function process()
    {
        /** @var msProduct $target */
        if (!$target = $this->modx->getObject($this->classKey, array('id' => $this->getProperty('target')))) {
            return $this->failure();
        }
        /** @var msProduct $source */
        $source = $this->modx->getObject($this->classKey, array('id' => $this->getProperty('source')));
        $this->sort($source, $target);
        $this->updateIndex();
        
        return $this->modx->error->success();
    }

    /**
     * @param msProduct $source
     * @param msProduct $target
     */
    public function sort(modxNotesItem $source, modxNotesItem $target)
    {
        $c = $this->modx->newQuery($this->classKey);
        $c->command('UPDATE');
        
        if ($source->get('rank') < $target->get('rank')) {
            $c->query['set']['rank'] = array(
                'value' => '`rank` - 1',
                'type' => false,
            );
            $c->andCondition(array(
                'rank:<=' => $target->rank,
                'rank:>' => $source->rank,
            ));
            $c->andCondition(array(
                'rank:>' => 0,
            ));
        } else {
            $c->query['set']['rank'] = array(
                'value' => '`rank` + 1',
                'type' => false,
            );
            $c->andCondition(array(
                'rank:>=' => $target->rank,
                'rank:<' => $source->rank,
            ));
        }
        $c->prepare();
        $c->stmt->execute();
        $source->set('rank', $target->get('rank'));

        $this->modx->invokeEvent($this->beforeSaveEvent, array(
            'object' => $source,
        ));

        if ($source->save() == false) {
            return $this->failure($this->modx->lexicon('modxnotes_item_err_save'));
        }

        $this->modx->invokeEvent($this->afterSaveEvent, array(
            'object' => $source,
        ));
    }

    /**
     *
     */
    public function updateIndex()
    {
        // Update indexes
        $c = $this->modx->newQuery($this->classKey);
        $c->select('id');
        $c->sortby('rank ASC, id', 'ASC');
        if ($c->prepare() && $c->stmt->execute()) {
            $table = $this->modx->getTableName($this->classKey);
            $update = $this->modx->prepare("UPDATE {$table} SET rank = ? WHERE id = ?");
            $i = 0;
            while ($id = $c->stmt->fetch(PDO::FETCH_COLUMN)) {
                $update->execute(array($i, $id));
                $i++;
            }
        }
    }
}
return 'modxNotesItemSortProcessor';