const supabase = require('../config/db');

exports.setupChatbot = async (req, res) => {
    const { widget_id, display_type, page_url } = req.body;

    if (!widget_id) {
        return res.status(400).json({ error: 'Widget ID is required' });
    }

    try {
        const { data: widgetConfig, error } = await supabase
            .from('chatbot_configurations')
            .select('*')
            .eq('chatbot_id', widget_id)
            .single();


        if (error) {
            throw error;
        }

        res.json({
            success: true,
            data: widgetConfig,
        });
    } catch (error) {
        console.error('Error fetching widget config:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch widget config' });
    }
};
