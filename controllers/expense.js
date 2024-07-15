const Expense = require('../modles/expense');

exports.getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: {userId: req.user.id}});
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createExpense = async (req, res, next) => {
    const { amount, description, category } = req.body;
    // const userId = req.user.id;
    try {
        const newExpense = await Expense.create({ amount, description, category, userId: req.user.id});
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res, next) => {
    const { id } = req.params;
    try {
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        await expense.destroy();
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
