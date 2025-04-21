const Appeal = require('../models/Appeal');

exports.createAppeal = async (req, res) => {
  try {
    const { theme, text } = req.body;
    const appeal = await Appeal.create({ theme, text });
    res.status(201).json(appeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.takeToWork = async (req, res) => {
  try {
    const { id } = req.params;
    const appeal = await Appeal.findByPk(id);
    
    if (!appeal) {
      return res.status(404).json({ error: 'Обращение не найдено' });
    }
    
    if (appeal.status !== 'Новое') {
      return res.status(400).json({ error: 'Можно взять в работу только новые обращения' });
    }
    
    appeal.status = 'В работе';
    await appeal.save();
    
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeAppeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { solution } = req.body;
    const appeal = await Appeal.findByPk(id);
    
    if (!appeal) {
      return res.status(404).json({ error: 'Обращение не найдено' });
    }
    
    if (appeal.status !== 'В работе') {
      return res.status(400).json({ error: 'Можно завершить только обращения в работе' });
    }
    
    appeal.status = 'Завершено';
    appeal.solution = solution;
    await appeal.save();
    
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelAppeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    const appeal = await Appeal.findByPk(id);
    
    if (!appeal) {
      return res.status(404).json({ error: 'Обращение не найдено' });
    }
    
    if (appeal.status === 'Завершено' || appeal.status === 'Отменено') {
      return res.status(400).json({ error: 'Нельзя отменить завершенное или уже отмененное обращение' });
    }
    
    appeal.status = 'Отменено';
    appeal.cancelReason = cancelReason;
    await appeal.save();
    
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppeals = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let where = {};
    
    if (date) {
      where.createdAt = {
        [Op.between]: [
          new Date(date + ' 00:00:00'),
          new Date(date + ' 23:59:59')
        ]
      };
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [
          new Date(startDate + ' 00:00:00'),
          new Date(endDate + ' 23:59:59')
        ]
      };
    }
    
    const appeals = await Appeal.findAll({ where });
    res.json(appeals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelAllInProgress = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const result = await Appeal.update(
      { status: 'Отменено', cancelReason },
      { where: { status: 'В работе' } }
    );
    
    res.json({ message: `Отменено ${result[0]} обращений` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};