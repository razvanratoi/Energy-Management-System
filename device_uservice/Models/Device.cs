﻿using System.ComponentModel.DataAnnotations;

namespace DeviceMicroservice.Models;

public class Device
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public double MaxHourlyConsumption { get; set; }
}