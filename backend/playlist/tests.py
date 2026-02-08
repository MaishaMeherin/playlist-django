# playlist/tests.py
from django.test import TestCase
from .utils import calculate_position

class PositionAlgorithmTests(TestCase):
    """Test the fractional indexing algorithm"""
    
    def test_middle_position(self):
        """Insert between two items"""
        result = calculate_position(1.0, 2.0)
        self.assertEqual(result, 1.5)
    
    def test_first_position(self):
        """Insert at beginning"""
        result = calculate_position(None, 1.0)
        self.assertEqual(result, 0.0)
    
    def test_last_position(self):
        """Insert at end"""
        result = calculate_position(2.0, None)
        self.assertEqual(result, 3.0)
    
    def test_empty_playlist(self):
        """First item in empty playlist"""
        result = calculate_position(None, None)
        self.assertEqual(result, 1.0)
    
    def test_tight_gap(self):
        """Insert in small gap"""
        result = calculate_position(1.0, 1.5)
        self.assertEqual(result, 1.25)
    
    def test_infinite_insertions(self):
        """Verify infinite insertions possible"""
        pos1 = calculate_position(1.0, 2.0)
        self.assertEqual(pos1, 1.5)
        
        pos2 = calculate_position(1.0, 1.5)
        self.assertEqual(pos2, 1.25)
        
        pos3 = calculate_position(1.0, 1.25)
        self.assertEqual(pos3, 1.125)