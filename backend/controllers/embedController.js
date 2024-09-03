const supabase = require('../config/db');  // Make sure your Supabase client is properly set up

// Controller function for setting up the chatbot widget
exports.setupChatbot = async (req, res) => {
    const { widget_id, display_type, page_url } = req.body;

    if (!widget_id) {
        return res.status(400).json({ error: 'Widget ID is required' });
    }

    try {
        // Fetch configuration for the widget from Supabase or your database
        const { data: widgetConfig, error } = await supabase
            .from('chatbot_configurations')  // Correct table name
            .select('*')
            .eq('chatbot_id', widget_id)  // Updated column name
            .single();


        if (error) {
            throw error;
        }

        // Assuming `widgetConfig` has the necessary data for widget initialization
        res.json({
            success: true,
            data: widgetConfig,
        });
    } catch (error) {
        console.error('Error fetching widget config:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch widget config' });
    }
};
